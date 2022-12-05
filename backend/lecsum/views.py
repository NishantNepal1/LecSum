from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from wsgiref.util import FileWrapper
import PyPDF2
import io

import sys
sys.path.insert(1, './nlp')
import summary

# Create your views here.
def get(request):
    return JsonResponse({"text": "Simple get request"})

@csrf_exempt
@api_view(['GET'])
def getFile(request):
    bodyData = request.data
    query_dictionary = request.query_params

    try:
        path = "../demoFiles/demeFile1.pdf"
        response = FileResponse(open(path, 'rb').read())
        response.headers = {   
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename="demoFile2.pdf"',
        }
        response.as_attachment = True
        return response
    except:
        return JsonResponse({'result': "Error sending pdf   " + query})

    # short_report = open(path, 'rb')
    # response = HttpResponse(FileWrapper(short_report), content_type='application/pdf')
    # return response


def dynamicParams(request, id):
    return JsonResponse({"id": id})

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
    print("--------------------------------------------------" + "\n\n\n")
    print("--------------------------------------------------" + "\n\n\n")
    print(result)
    

    query_dictionary = request.query_params
    return Response({"input": result})