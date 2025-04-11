# HundeparkFinder.de - Deployment Guide

This document provides instructions for deploying the HundeparkFinder.de website to Vercel.

## Project Structure

The project is a Next.js application with the App Router pattern. It includes:

- React components for the UI
- Server-side data handling for dog park information
- API routes for accessing data
- Responsive design with Tailwind CSS
- Interactive maps with Leaflet

## Deployment Instructions

### Option 1: Deploy to Vercel (Recommended)

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) if you don't have an account

2. **Install Dependencies**
   - Extract the zip file
   - Open a terminal in the extracted directory
   - Run `npm install` to install dependencies

3. **Deploy with Vercel CLI**
   - Install Vercel CLI: `npm install -g vercel`
   - Run `vercel login` and follow the prompts
   - Run `vercel` in the project directory
   - Follow the prompts to deploy

4. **Deploy via Vercel Dashboard**
   - Push the code to a GitHub repository
   - Log in to your Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project settings (no special configuration needed)
   - Click "Deploy"

### Option 2: Run Locally

1. **Install Dependencies**
   - Extract the zip file
   - Open a terminal in the extracted directory
   - Run `npm install` to install dependencies

2. **Run Development Server**
   - Run `npm run dev`
   - Open [http://localhost:3000](http://localhost:3000) in your browser

3. **Build for Production**
   - Run `npm run build`
   - Run `npm start` to start the production server

## Post-Deployment Steps

1. **Verify Deployment**
   - Check that all pages load correctly
   - Test search functionality
   - Verify map integration works
   - Test on mobile devices

2. **Update Data**
   - To update dog park data, edit the CSV file in `public/data/hundewiesen_germany.csv`
   - Redeploy the application after updating data

## Troubleshooting

If you encounter any issues during deployment:

1. **Build Errors**
   - Check the error messages in the Vercel deployment logs
   - Ensure all dependencies are correctly installed

2. **API Routes Not Working**
   - Verify that the API routes are correctly configured
   - Check that the data file is accessible

3. **Map Not Displaying**
   - Ensure Leaflet CSS is properly loaded
   - Check that coordinates are valid

## Contact

If you need further assistance, please contact the development team.
