#!/usr/bin/env python3
"""
Dog Park Data Scraper for HundeparkFinder.de

This script collects data on dog parks (Hundewiesen) across major German cities
using Google Maps and other sources.
"""

import os
import csv
import time
import json
import random
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Configuration
OUTPUT_DIR = "dog_park_data"
CSV_FILENAME = "hundewiesen_germany.csv"
LOG_FILENAME = "scraping_log.txt"

# Target cities - starting with top 4
TARGET_CITIES = [
    "Berlin",
    "Hamburg",
    "München",
    "Köln"
]

# Search queries for each city
SEARCH_QUERIES = [
    "Hundewiese {}",
    "Hundespielplatz {}",
    "Hundepark {}",
    "Hundeauslauf {}",
    "Eingezäunte Hundewiese {}"
]

# CSV headers
CSV_HEADERS = [
    "id",
    "name",
    "address",
    "postal_code",
    "city",
    "state",
    "latitude",
    "longitude",
    "google_maps_url",
    "phone",
    "opening_hours",
    "website",
    "description",
    "is_fenced",
    "has_water",
    "has_agility",
    "has_seating",
    "has_waste_bins",
    "has_lighting",
    "has_parking",
    "photos",
    "rating",
    "reviews",
    "size",
    "last_updated",
    "data_source"
]

class DogParkScraper:
    """Class to scrape dog park data from Google Maps and other sources."""
    
    def __init__(self):
        """Initialize the scraper."""
        self.setup_directories()
        self.setup_logging()
        self.setup_webdriver()
        self.parks_data = []
        self.park_id_counter = 1
        
    def setup_directories(self):
        """Create necessary directories."""
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)
            self.log("Created output directory: {}".format(OUTPUT_DIR))
    
    def setup_logging(self):
        """Set up logging."""
        self.log_file = open(os.path.join(OUTPUT_DIR, LOG_FILENAME), 'a')
        self.log("=== Scraping session started at {} ===".format(
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    
    def log(self, message):
        """Log a message to the log file and print to console."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = "[{}] {}".format(timestamp, message)
        print(log_message)
        if hasattr(self, 'log_file'):
            self.log_file.write(log_message + "\n")
            self.log_file.flush()
    
    def setup_webdriver(self):
        """Set up the Selenium WebDriver."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--lang=de-DE")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        
        try:
            # Use Service object with path to chromedriver
            service = Service('/usr/bin/chromedriver')
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.log("WebDriver initialized successfully")
        except Exception as e:
            self.log("Error initializing WebDriver: {}".format(str(e)))
            raise
    
    def search_dog_parks(self, city):
        """Search for dog parks in a specific city."""
        self.log("Searching for dog parks in {}".format(city))
        
        city_parks = []
        
        for query_template in SEARCH_QUERIES:
            query = query_template.format(city)
            self.log("Using search query: '{}'".format(query))
            
            # Construct Google Maps search URL
            search_url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}/"
            
            try:
                self.driver.get(search_url)
                self.log("Navigated to: {}".format(search_url))
                
                # Wait for results to load
                time.sleep(5)
                
                # Extract park listings
                try:
                    # First try to find results container
                    results_container = self.driver.find_element(By.CSS_SELECTOR, "div[role='feed']")
                    self.log("Found results container")
                    
                    # Scroll to load more results
                    for _ in range(3):
                        self.driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", results_container)
                        time.sleep(2)
                    
                    # Get park elements
                    park_elements = self.driver.find_elements(By.CSS_SELECTOR, "div[role='article']")
                    self.log("Found {} potential park listings".format(len(park_elements)))
                    
                    # Process each park
                    for element in park_elements[:5]:  # Limit to first 5 for testing
                        try:
                            # Get park name
                            park_name_element = element.find_element(By.CSS_SELECTOR, "div[role='heading']")
                            park_name = park_name_element.text
                            
                            # Skip if already processed this park
                            if any(park["name"] == park_name for park in city_parks):
                                continue
                            
                            self.log("Processing park: {}".format(park_name))
                            
                            # Click on the park to view details
                            park_name_element.click()
                            time.sleep(3)
                            
                            # Extract park details
                            park_data = self.extract_park_details(park_name, city)
                            if park_data:
                                city_parks.append(park_data)
                                self.parks_data.append(park_data)
                                
                                # Save progress after each park
                                self.save_progress()
                            
                            # Go back to results
                            self.driver.back()
                            time.sleep(2)
                            
                        except Exception as e:
                            self.log("Error processing park element: {}".format(str(e)))
                            continue
                
                except NoSuchElementException:
                    self.log("Could not find results container, trying alternative approach")
                    
                    # Alternative approach: look for any clickable elements that might be parks
                    elements = self.driver.find_elements(By.CSS_SELECTOR, "a[aria-label]")
                    self.log("Found {} potential elements with alternative approach".format(len(elements)))
                    
                    for element in elements[:5]:  # Limit to first 5 for testing
                        try:
                            aria_label = element.get_attribute("aria-label")
                            if aria_label and ("park" in aria_label.lower() or "hunde" in aria_label.lower()):
                                self.log("Found potential park: {}".format(aria_label))
                                element.click()
                                time.sleep(3)
                                
                                # Extract park details
                                park_data = self.extract_park_details(aria_label, city)
                                if park_data:
                                    city_parks.append(park_data)
                                    self.parks_data.append(park_data)
                                    
                                    # Save progress after each park
                                    self.save_progress()
                                
                                # Go back to results
                                self.driver.back()
                                time.sleep(2)
                        except Exception as e:
                            self.log("Error processing alternative element: {}".format(str(e)))
                            continue
            
            except Exception as e:
                self.log("Error during search for '{}': {}".format(query, str(e)))
                continue
            
            # Random delay between queries
            delay = random.uniform(3, 5)
            self.log("Waiting for {} seconds before next query".format(delay))
            time.sleep(delay)
        
        self.log("Completed search for {}. Found {} unique dog parks.".format(city, len(city_parks)))
        return city_parks
    
    def extract_park_details(self, park_name, city):
        """Extract detailed information about a dog park."""
        try:
            # Initialize park data dictionary
            park_data = {
                "id": self.park_id_counter,
                "name": park_name,
                "city": city,
                "last_updated": datetime.now().strftime("%Y-%m-%d"),
                "data_source": "Google Maps"
            }
            self.park_id_counter += 1
            
            # Take screenshot for debugging
            screenshot_dir = os.path.join(OUTPUT_DIR, "screenshots")
            if not os.path.exists(screenshot_dir):
                os.makedirs(screenshot_dir)
            
            screenshot_path = os.path.join(screenshot_dir, f"park_{park_data['id']}.png")
            self.driver.save_screenshot(screenshot_path)
            self.log(f"Saved screenshot to {screenshot_path}")
            
            # Get current URL
            current_url = self.driver.current_url
            park_data["google_maps_url"] = current_url
            
            # Extract coordinates from URL
            if "@" in current_url:
                coords_part = current_url.split("@")[1].split(",")
                if len(coords_part) >= 2:
                    park_data["latitude"] = coords_part[0]
                    park_data["longitude"] = coords_part[1]
            
            # Extract address
            try:
                # Try different selectors for address
                address_selectors = [
                    "button[data-item-id='address']",
                    "button[aria-label*='Adresse']",
                    "button[aria-label*='address']"
                ]
                
                for selector in address_selectors:
                    try:
                        address_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                        full_address = address_element.text
                        park_data["address"] = full_address
                        self.log(f"Found address: {full_address}")
                        
                        # Try to extract postal code
                        postal_code = None
                        for part in full_address.split():
                            if part.isdigit() and len(part) == 5:  # German postal codes are 5 digits
                                postal_code = part
                                break
                        
                        if postal_code:
                            park_data["postal_code"] = postal_code
                        
                        # Try to extract state from address
                        german_states = [
                            "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
                            "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
                            "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
                            "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
                        ]
                        
                        for state in german_states:
                            if state in full_address:
                                park_data["state"] = state
                                break
                        
                        break  # Exit loop if address found
                    except NoSuchElementException:
                        continue
            except Exception as e:
                self.log(f"Error extracting address: {str(e)}")
            
            # Extract phone number
            try:
                phone_selectors = [
                    "button[data-item-id='phone:tel']",
                    "button[aria-label*='Telefon']",
                    "button[aria-label*='phone']"
                ]
                
                for selector in phone_selectors:
                    try:
                        phone_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                        park_data["phone"] = phone_element.text
                        self.log(f"Found phone: {phone_element.text}")
                        break
                    except NoSuchElementException:
                        continue
            except Exception:
                pass
            
            # Extract website
            try:
                website_selectors = [
                    "a[data-item-id='authority']",
                    "a[aria-label*='Website']",
                    "a[aria-label*='website']"
                ]
                
                for selector in website_selectors:
                    try:
                        website_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                        park_data["website"] = website_element.get_attribute("href")
                        self.log(f"Found website: {website_element.get_attribute('href')}")
                        break
                    except NoSuchElementException:
                        continue
            except Exception:
                pass
            
            # Extract opening hours
            try:
                hours_selectors = [
                    "div[data-item-id='oh']",
                    "div[aria-label*='Öffnungszeiten']",
                    "div[aria-label*='hours']"
                ]
                
                for selector in hours_selectors:
                    try:
                        hours_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                        park_data["opening_hours"] = hours_element.text.replace("\n", "; ")
                        self.log(f"Found hours: {hours_element.text}")
                        break
                    except NoSuchElementException:
                        continue
            except Exception:
                pass
            
            # Extract rating
            try:
                rating_selectors = [
                    "div.fontDisplayLarge",
                    "span[aria-hidden='true']"
                ]
                
                for selector in rating_selectors:
                    try:
                        rating_elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        for element in rating_elements:
                            text = element.text
                            if text and "." in text and len(text) <= 3:
                                park_data["rating"] = text
                                self.log(f"Found rating: {text}")
           
(Content truncated due to size limit. Use line ranges to read in chunks)