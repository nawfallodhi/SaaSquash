# SaaSquatch Referral Simulation

This is a real-time referral network simulation built as part of my application to Impact.com. It demonstrates how referral systems generate growth through user sharing, rewards, and network effects.

## Overview

The project simulates a referral marketing system where users refer other users, trigger rewards, and grow a dynamic network graph over time. The goal is to visually represent how referral loops compound and scale.

## Features

- Live referral network graph (nodes and edges)
- Automatic referral generation between users
- Reward and revenue tracking system
- Real-time activity feed of events
- Milestone notifications based on referral count
- Intro onboarding flow before simulation starts
- Center-screen signup popup triggered after 10 referrals
- Pause/resume simulation controls

## Tech Stack

- React
- JavaScript (ES6+)
- Custom SVG-based graph rendering
- Inline styling with CSS variables

No external graph or visualization libraries were used.

## How it works

- The app starts on an intro screen
- Once the user enters the demo, the simulation loop begins
- At each interval, a user refers another user
- New nodes and connections are added to the graph
- Stats, rewards, and events update in real time
- The simulation resets after reaching a maximum node threshold

## Project structure

src/
  components/
  data/
  assets/
  App.jsx
  main.jsx

## Purpose

This project was built to demonstrate understanding of referral systems, growth loops, and interactive frontend architecture. It focuses on how user-driven networks can create compounding growth effects.

## Running locally

npm install
npm run dev

## Notes

This is a simulation and not connected to a backend or production referral system.