import summary
from reportlab.pdfgen import canvas
import textwrap

text = "LINCOLNSHIRE, IL With next-generation video game systems such as the Xbox One and the Playstation 4 hitting stores later this month, the console wars got even hotter today as electronics manufacturer Zenith announced the release of its own console, the Gamespace Pro, which arrives in stores Nov. 19. “With its sleek silver-and-gray box, double-analog-stick controllers, ability to play CDs, and starting price of $374.99, the Gamespace Pro is our way of saying, ‘Move over, Sony and Microsoft, Zenith is now officially a player in the console game,’” said Zenith CEO Michael Ahn at a Gamespace Pro press event, showcasing the system’s launch titles MoonChaser: Radiation, Cris Collinsworth’s Pigskin 2013, and survival-horror thriller InZomnia. “With over nine launch titles, 3D graphics, and the ability to log on to the internet using our Z-Connect technology, Zenith is finally poised to make some big waves in the video game world.” According to Zenith representatives, over 650 units have already been preordered."
percentage = 0.3

result = summary.main(text, percentage)

long_text = result.split("\n")
s_wrap_list = textwrap.fill(long_text.pop(0), 90)
final_result = "Summary:\n\n"
final_result += s_wrap_list
final_result += "\n\n\nExtracted Keywords:\n\n"
for i in long_text:
    final_result += i+"\n"

# f = final_result.encode('utf-8')
# f = f.decode('latin-1')
# create_pdf(f, "yeah.pdf")

splitted_segments = final_result.splitlines()
splitted_segments_n = [i + '\n' for i in splitted_segments]
i = 750
numeroLinea = 0

PATH_TO_PDF = './test.pdf' # path to your pdf file
can = canvas.Canvas(PATH_TO_PDF)
while numeroLinea < len(splitted_segments_n):
    if numeroLinea - len(splitted_segments_n) < 90:
        i=750
        for linea in splitted_segments_n[numeroLinea:numeroLinea+60]:      
            can.drawString(15, i, linea.strip())
            numeroLinea += 1
            i -= 12
        can.showPage()
    else:
        i = 750
        for linea in splitted_segments_n[numeroLinea:]:
           can.drawString(15, i, linea.strip())
           numeroLinea += 1
           i -= 12
        can.showPage()
        
can.save()
