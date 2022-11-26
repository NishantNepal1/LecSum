from django.urls import path
# from django.conf.urls import 
from . import views

#Routes configs
urlpatterns = [
    path('sendFiles/', views.recieveFiles),
    # path('getFile/<str:id>/', views.dynamicParams),
    path('getFile/', views.getFile),
    # path('getFile2/<int:id>/', views.dynamicParams, name = 'fileName'),
]