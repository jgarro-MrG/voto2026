try:
    import pypdf
    print("pypdf installed")
except ImportError:
    try:
        import PyPDF2
        print("PyPDF2 installed")
    except ImportError:
        print("No PDF library found")
