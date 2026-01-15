"""
HTML Template Updater for Maze Gallery

This script updates the maze gallery HTML by rendering a Jinja2 template
with the current list of generated maze images.

Author: Sturla Bragason
"""

import os
from jinja2 import Environment, FileSystemLoader

def update_html():
    """Update the maze gallery HTML with current maze images.
    
    Renders the Jinja2 template with the sorted list of maze images
    and writes the output to mazes/index.html.
    """
    # Load files from the root directory
    file_loader = FileSystemLoader('.')
    env = Environment(loader=file_loader)

    # Load the template from the specified location
    template = env.get_template('.github/templates/index_template.html')

    # Get the list of maze images
    image_files = [f for f in os.listdir('./mazes') if f.endswith('.png')]
    image_files.sort(reverse=True)  # Sort by creation time (newest first)

    # Render the template with the images
    output = template.render(images=image_files)

    # Write the rendered HTML to the output file
    with open('./mazes/index.html', 'w') as f:
        f.write(output)

if __name__ == "__main__":
    update_html()
