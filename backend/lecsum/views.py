from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from wsgiref.util import FileWrapper
import PyPDF2
import io
from reportlab.pdfgen import canvas
import textwrap
import uuid
from threading import Timer
import os

import sys
sys.path.insert(1, './nlp')
import summary


# Create your views here.
def get(request):
    return JsonResponse({"text": "Simple get request"})


# return pdf files from files folder to front-end
@csrf_exempt
@api_view(['GET'])
def getFile(request):
    query_dictionary = request.query_params
    path = query_dictionary["filePath"]
    file_path = f"./lecsum/files/{path}"

    response = FileResponse(open(file_path, 'rb'))
    response.headers = {   
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename="Summarization.pdf"',
    }

    response.as_attachment = True
    return response


def dynamicParams(request, id):
    return JsonResponse({"id": id})

def deleteFile(fileId):
    filePath = f"./lecsum/files/{fileId}.pdf"
    try:
        os.remove(filePath)
    except OSError as e:
        print("Error: %s : %s" % (filePath, e.strerror))

@csrf_exempt
@api_view(['POST'])
def recieveFiles(request): 
    bodyData = request.data
    files = bodyData.get("files", "error accessing files")

    if len(bodyData) > 5:
        return Response({"result": "Too many files!"})

    completeText = ""
    # extract keys from body dic
    for key in bodyData:
        file = bodyData.get(key, False)

        if not file:
            return Response({"result": "One of the files is empty!"})
        
        pdfReader = PyPDF2.PdfFileReader(file.open())
        pageCount = pdfReader.getNumPages()

        for pageNum in range(pageCount):
            pageContent = pdfReader.getPage(pageNum)
            completeText += pageContent.extractText()
        
        completeText += "\n"

    result = summary.main(completeText, 0.3)
    print(completeText + "--------------------------------------------------" + "\n\n\n")
    print(result)

    # Giving unique id to distinguish files
    unique_id = uuid.uuid4()
    filePath = f"./lecsum/files/{unique_id}.pdf"

    # Deletes the file after 5 minutes on multi-thread
    time_till_deletion = 60.0 * 5
    deletion = Timer(time_till_deletion, deleteFile, [unique_id])
    deletion.start()

    generate_pdf(result, filePath)

    return Response({"filePath": unique_id})  

def generate_pdf(summarizedText, filePath):
    long_text = summarizedText.split("\n")
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

    # PATH_TO_PDF = './test2.pdf' # path to your pdf file
    can = canvas.Canvas(filePath)
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