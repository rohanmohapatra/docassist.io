from html2docx import html2docx

with open("output.html") as fp:
    html = fp.read()

# html2docx() returns an io.BytesIO() object. The HTML must be valid.
buf = html2docx(html, title="My Document")

with open("output2.docx", "wb") as fp:
    fp.write(buf.getvalue())