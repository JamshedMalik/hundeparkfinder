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
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Configuration
OUTPUT_DIR = "dog_park_data"
CSV_FILENAME = "hundewiesen_germany.csv"
LOG_FILENAME = "scraping_log.txt"

# Target cities
TARGET_CITIES = [
    "Berlin",
    "Hamburg",
    "München",
    "Köln",
    "Frankfurt",
    "Stuttgart",
    "Düsseldorf",
    "Leipzig",
    "Dresden",
    "Hannover"
]

# Search queries for each city
SEARCH_QUERIES = [
    "Hundewiese {}",
    "Hundespielplatz {}",
    "Hundepark {}",
    "Hundeauslauf {}",
    "Eingezäunte Hundewiese {}",
    "Hundefreilauf {}"
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
            self.driver = webdriver.Chrome(options=chrome_options)
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
                
                # Scroll to load more results
                self.scroll_results()
                
                # Extract park listings
                park_elements = self.driver.find_elements(By.CSS_SELECTOR, "div[role='article']")
                self.log("Found {} potential park listings".format(len(park_elements)))
                
                for element in park_elements:
                    try:
                        park_name = element.find_element(By.CSS_SELECTOR, "div[role='heading']").text
                        
                        # Skip if already processed this park
                        if any(park["name"] == park_name for park in city_parks):
                            continue
                        
                        self.log("Processing park: {}".format(park_name))
                        
                        # Click on the park to view details
                        element.click()
                        time.sleep(3)
                        
                        # Extract park details
                        park_data = self.extract_park_details(park_name, city)
                        if park_data:
                            city_parks.append(park_data)
                            
                            # Save progress after each park
                            self.save_progress()
                        
                        # Go back to results
                        self.driver.back()
                        time.sleep(2)
                        
                    except Exception as e:
                        self.log("Error processing park element: {}".format(str(e)))
                        continue
            
            except Exception as e:
                self.log("Error during search for '{}': {}".format(query, str(e)))
                continue
            
            # Random delay between queries
            delay = random.uniform(3, 7)
            self.log("Waiting for {} seconds before next query".format(delay))
            time.sleep(delay)
        
        self.log("Completed search for {}. Found {} unique dog parks.".format(city, len(city_parks)))
        return city_parks
    
    def scroll_results(self):
        """Scroll through results to load more items."""
        try:
            # Find the results container
            results_container = self.driver.find_element(By.CSS_SELECTOR, "div[role='feed']")
            
            # Scroll multiple times with pauses
            for _ in range(5):
                self.driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", results_container)
                time.sleep(2)
            
            self.log("Scrolled through results to load more items")
        except Exception as e:
            self.log("Error scrolling results: {}".format(str(e)))
    
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
            
            # Extract address
            try:
                address_element = self.driver.find_element(By.CSS_SELECTOR, "button[data-item-id='address']")
                full_address = address_element.text
                park_data["address"] = full_address
                
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
                
                # Get coordinates from URL
                current_url = self.driver.current_url
                if "@" in current_url:
                    coords_part = current_url.split("@")[1].split(",")
                    if len(coords_part) >= 2:
                        park_data["latitude"] = coords_part[0]
                        park_data["longitude"] = coords_part[1]
                
                park_data["google_maps_url"] = current_url
                
            except NoSuchElementException:
                self.log("Address not found for: {}".format(park_name))
            
            # Extract phone number
            try:
                phone_element = self.driver.find_element(By.CSS_SELECTOR, "button[data-item-id='phone:tel']")
                park_data["phone"] = phone_element.text
            except NoSuchElementException:
                pass
            
            # Extract website
            try:
                website_element = self.driver.find_element(By.CSS_SELECTOR, "a[data-item-id='authority']")
                park_data["website"] = website_element.get_attribute("href")
            except NoSuchElementException:
                pass
            
            # Extract opening hours
            try:
                hours_element = self.driver.find_element(By.CSS_SELECTOR, "div[data-item-id='oh']")
                park_data["opening_hours"] = hours_element.text.replace("\n", "; ")
            except NoSuchElementException:
                pass
            
            # Extract rating
            try:
                rating_element = self.driver.find_element(By.CSS_SELECTOR, "div.fontDisplayLarge")
                park_data["rating"] = rating_element.text
            except NoSuchElementException:
                pass
            
            # Extract reviews
            try:
                reviews_container = self.driver.find_elements(By.CSS_SELECTOR, "div.fontBodyMedium")
                if reviews_container and len(reviews_container) > 0:
                    reviews_text = []
                    for i, review in enumerate(reviews_container[:3]):  # Get first 3 reviews
                        if review.text and len(review.text) > 20:  # Likely a review, not metadata
                            reviews_text.append(review.text.replace("\n", " "))
                    
                    if reviews_text:
                        park_data["reviews"] = " | ".join(reviews_text)
            except Exception:
                pass
            
            # Try to determine if the park is fenced based on name and description
            fenced_keywords = ["eingezäunt", "umzäunt", "zaun", "geschlossen"]
            park_data["is_fenced"] = "unknown"
            
            park_name_lower = park_name.lower()
            for keyword in fenced_keywords:
                if keyword in park_name_lower:
                    park_data["is_fenced"] = "yes"
                    break
            
            if "reviews" in park_data:
                reviews_lower = park_data["reviews"].lower()
                for keyword in fenced_keywords:
                    if keyword in reviews_lower:
                        park_data["is_fenced"] = "yes"
                        break
            
            # Extract description from reviews if available
            if "reviews" in park_data:
                park_data["description"] = "Based on visitor reviews: " + park_data["reviews"][:200] + "..."
            
            return park_data
            
        except Exception as e:
            self.log("Error extracting details for {}: {}".format(park_name, str(e)))
            return None
    
    def save_progress(self):
        """Save the current progress to CSV file."""
        csv_path = os.path.join(OUTPUT_DIR, CSV_FILENAME)
        
        # Check if file exists to determine if we need to write headers
        file_exists = os.path.isfile(csv_path)
        
        with open(csv_path, 'a', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=CSV_HEADERS)
            
            if not file_exists:
                writer.writeheader()
            
            # Write only the most recently added park
            if self.parks_data:
                latest_park = self.parks_data[-1]
                # Ensure all fields exist in the dictionary
                for field in CSV_HEADERS:
                    if field not in latest_park:
                        latest_park[field] = ""
                writer.writerow(latest_park)
        
        self.log("Saved progress to {}".format(csv_path))
    
    def run(self, cities=None):
        """Run the scraper for specified cities or all target cities."""
        if cities is None:
            cities = TARGET_CITIES
        
        try:
            for city in cities:
                self.log("Starting data collection for {}".format(city))
                city_parks = self.search_dog_parks(city)
                self.parks_data.extend(city_parks)
                
                # Save after each city
                self.save_all_data()
                
                # Random delay between cities
                delay = random.uniform(10, 20)
                self.log("Waiting for {} seconds before next city".format(delay))
                time.sleep(delay)
            
            self.log("Data collection completed for all cities")
            self.save_all_data()
            
        except Exception as e:
            self.log("Error during scraping: {}".format(str(e)))
        finally:
            self.cleanup()
    
    def save_all_data(self):
        """Save all collected data to CSV and JSON files."""
        # Save to CSV
        csv_path = os.path.join(OUTPUT_DIR, CSV_FILENAME)
        with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=CSV_HEADERS)
            writer.writeheader()
            
            for park in self.parks_data:
                # Ensure all fields exist in the dictionary
                for field in CSV_HEADERS:
                    if field not in park:
                        park[field] = ""
                writer.writerow(park)
        
        # Save to JSON for backup
        json_path = os.path.join(OUTPUT_DIR, "hundewiesen_germany.json")
        with open(json_path, 'w', encoding='utf-8') as jsonfile:
            json.dump(self.parks_data, jsonfile, ensure_ascii=False, indent=2)
        
        self.log("Saved all data to {} and {}".format(csv_path, json_path))
    
    def cleanup(self):
        """Clean up resources."""
        if hasattr(self, 'driver'):
            self.driver.quit()
            self.log("WebDriver closed")
        
        if hasattr(self, 'log_file'):
            self.log("=== Scraping session ended at {} ===".format(
                datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
      
(Content truncated due to size limit. Use line ranges to read in chunks)