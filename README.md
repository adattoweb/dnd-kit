# Drag-and-Drop Task Organizer with dnd-kit

This React app demonstrates how to build a draggable task organizer using the **dnd-kit** library. Tasks are grouped by dates ("days") and can be reordered within a day or moved between different days by dragging and dropping.

## Features

* Drag and drop tasks within the same day to reorder.
* Move tasks between different days.
* Supports mouse, touch, and keyboard sensors.
* Prevents dragging outside the browser window.
* Visual drag overlay for smooth dragging experience.

## How it works

* Each day is a droppable and sortable container.
* Tasks are draggable items inside their respective days.
* The app maintains the task order and grouping in React state.
* When dragging over another day or task, the app updates state accordingly.

## Usage

1. Run the app in a React environment.
2. Drag tasks to reorder within the same day or move them to another day.
3. The task lists update instantly, reflecting the changes.

