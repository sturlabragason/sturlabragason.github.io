import os
from jinja2 import Environment, FileSystemLoader

def update_html():
    # Get the absolute path to the directory containing this script
    script_dir = os.path.dirname(os.path.realpath(__file__))

    # Load files from the script directory
    file_loader = FileSystemLoader(script_dir)
    env = Environment(loader=file_loader)

    # Construct the paths to the template and mazes directory
    template_path = os.path.join(script_dir, '.github/templates/index_template.html')
    mazes_dir = os.path.join(script_dir, 'mazes')

    # Load the template from the specified location
    template = env.get_template(template_path)

    # Get the list of maze images
    image_files = [f for f in os.listdir(mazes_dir) if f.endswith('.png')]
    image_files.sort(reverse=True)  # Sort by creation time (newest first)

    # Render the template with the images
    output = template.render(images=image_files)

    # Write the rendered HTML to the output file
    output_path = os.path.join(mazes_dir, 'index.html')
    with open(output_path, 'w') as f:
        f.write(output)

if __name__ == "__main__":
    update_html()
