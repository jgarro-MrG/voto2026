import os
import sys
import subprocess
import glob

def install(package):
    print(f"Attempting to install {package}...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
    except subprocess.CalledProcessError as e:
        print(f"Error installing {package}: {e}")
        # Try without -m pip just in case, though unlikely to help if module execution fails
        pass

try:
    import pypdf
except ImportError:
    print("pypdf not found. Installing...")
    install("pypdf")
    try:
        import pypdf
    except ImportError:
        print("Failed to import pypdf after installation attempt.")
        sys.exit(1)

def extract_text_from_pdf(pdf_path, output_path):
    try:
        print(f"Reading {pdf_path}...")
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        # Limit to first 100 pages to avoid huge files if unnecessary, 
        # but for govt plans we probably want it all.
        for i, page in enumerate(reader.pages):
            try:
                text += page.extract_text() + "\n"
            except Exception as e:
                print(f"Error on page {i} of {pdf_path}: {e}")
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Saved text to {output_path}")
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")

def main():
    # Adjust paths to match user environment
    # Using absolute paths based on user_information or relative if running from root
    # Current Cwd in run_command usually works with relative path if we are in the right dir
    # But let's use the known path to be safe
    base_dir = r"//wsl.localhost/Ubuntu-24.04/home/jgarro/repos/meine/voto2026"
    planes_dir = os.path.join(base_dir, 'planes')
    output_dir = os.path.join(base_dir, 'planes-resumen')
    
    if not os.path.exists(planes_dir):
        print(f"Directory not found: {planes_dir}")
        # Fallback to current directory
        planes_dir = 'planes'
        output_dir = 'planes-resumen'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    pdf_files = glob.glob(os.path.join(planes_dir, '*.pdf'))
    print(f"Found {len(pdf_files)} PDF files in {planes_dir}")
    
    for pdf_file in pdf_files:
        filename = os.path.basename(pdf_file)
        name_without_ext = os.path.splitext(filename)[0]
        output_file = os.path.join(output_dir, f"{name_without_ext}.txt")
        
        # We can overwrite or skip. Let's overwrite to ensure fresh extraction
        # if os.path.exists(output_file):
        #     print(f"Skipping {filename}, already extracted.")
        #     continue
            
        print(f"Processing {filename}...")
        extract_text_from_pdf(pdf_file, output_file)

if __name__ == "__main__":
    main()
