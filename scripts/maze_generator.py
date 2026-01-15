"""
Maze Generator for Personal Website

This script generates 50 unique mazes using a recursive backtracking algorithm.
Mazes are saved as high-resolution PNG images for display in the maze gallery.

Author: Sturla Bragason
"""

import os
import numpy as np
import matplotlib.pyplot as plt
import time

# Dimensions for the maze
HEIGHT = 21
WIDTH = 21

def generate_maze(width, height):
    """Generate a maze using recursive backtracking algorithm.
    
    Args:
        width (int): Width of the maze (should be odd for proper wall structure)
        height (int): Height of the maze (should be odd for proper wall structure)
    
    Returns:
        numpy.ndarray: 2D boolean array where True represents walls and False represents paths
    """
    # Create a maze filled with walls
    maze = np.ones((height, width), dtype=bool)

    # Create a stack for the cells
    stack = []

    # Start from the second cell of the first row to ensure an entrance
    start_x, start_y = 1, 1
    maze[start_y, start_x] = False
    stack.append((start_x, start_y))

    # List of possible directions to move
    directions = [(0, 2), (0, -2), (2, 0), (-2, 0)]

    while stack:
        x, y = stack[-1]  # Current cell

        # Get all possible new positions
        new_positions = [(x+dx, y+dy) for dx, dy in directions if 0 <= x+dx < width and 0 <= y+dy < height and maze[y+dy, x+dx]]
        
        if new_positions:  # If there are new positions to move to
            dx, dy = new_positions[np.random.randint(len(new_positions))]  # Choose a random new position
            maze[y+(dy-y)//2, x+(dx-x)//2] = False  # Remove wall between cells
            maze[dy, dx] = False  # Move to new position
            stack.append((dx, dy))  # Add new position to stack
        else:  # If there are no new positions
            stack.pop()  # Backtrack to previous position

    # Make the last cell in the final row part of the path to ensure an exit
    maze[-2, -2] = False

    # Create a clear entrance and exit
    maze[0, 1] = False
    maze[-1, -2] = False

    return maze

def visualize_maze(maze, filename):
    """Visualize and save maze as high-resolution PNG.
    
    Args:
        maze (numpy.ndarray): 2D boolean array representing the maze
        filename (str): Output filename for the PNG image
    """
    fig, ax = plt.subplots(figsize=(10,10))
    ax.imshow(maze, cmap='Greys', interpolation='nearest')
    ax.axis('off')
    fig.savefig(filename, dpi=300)

# Create 'mazes' directory if not exists
if not os.path.exists('mazes'):
    os.makedirs('mazes')

# Generate and save 50 mazes
for i in range(50):
    maze = generate_maze(WIDTH, HEIGHT)
    filename = f'mazes/maze_{int(time.time())}.png'
    visualize_maze(maze, filename)
    # time.sleep(1)  # Ensure unique filenames by waiting 1 second between each generation
