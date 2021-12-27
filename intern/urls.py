from django.urls import path, include, re_path
from django.views.generic import TemplateView
from intern import views
from intern.controller import interncontroller

urlpatterns = [
    path ('',interncontroller.indexuser, name='user'),
    # path ('home',interncontroller.homeindex, name='home'),
    path('home',TemplateView.as_view(template_name='home.html')),

    path ('user',interncontroller.indexuser, name='user'),
    path ('createuser',interncontroller.createuser),
    path ('submituser',interncontroller.submituser),
    path ('deleteuser/<int:id>',interncontroller.deleteuser),
    path ('updateuser/<int:id>',interncontroller.updateuser),
    path ('updatesubmituser',interncontroller.updatesubmituser),
]