import mammoth

with open("document.docx", "rb") as docx_file:
    result = mammoth.convert_to_html(docx_file)
    html = result.value # The generated HTML
    with open("output.html","w") as html_file:
        html_file.write(html)