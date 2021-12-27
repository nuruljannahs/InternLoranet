from django.shortcuts import render, redirect
from intern.models import InternInfo, AuthUser

def indexuser(request):
    # user_id = request.session['user_id']
    # return HttpResponse(user_id)
    user = InternInfo.objects.all()
    print('print this', user)
    content = {
        'user':user
    }
    return render(request, 'user/indexuser.html', content)

    

#Function untuk html create user
def createuser(request):
    return render(request,'user/createuser.html')

def submituser(request):
    if request.method=='POST':
        first = request.POST['first_name']
        last = request.POST['last_name']
        username = request.POST['username']
        email = request.POST['email']
        intern_address = request.POST['intern_address']
        intern_phone = request.POST['intern_phone']
        guardian_name = request.POST['guardian_name']
        guardian_phone = request.POST['guardian_phone']
       
        # picture_profile = request.POST['picture_profile']
       
        # masuk ke database
        # object = nama model( namacolumn=nama variable, others - if any)
        user = InternInfo(first_name=first, last_name=last, username=username, email=email, intern_address=intern_address, intern_phone = intern_phone, 
                          guardian_name=guardian_name,guardian_phone=guardian_phone)
        user.save()
        return redirect('user')

def deleteuser(request, id):
    deleteI = InternInfo.objects.get(id=id)
    deleteI.delete()
    # success_url = reverse_lazy('indexuser')
    return redirect('user')

def updateuser(request,id):
    user = InternInfo.objects.get(id=id)
    # return HttpResponse(supplier)
    # user = AuthUser.objects.all()
    obj = {
        'user': user,
    }
    return render(request, 'user/updateuser.html', obj)

def updatesubmituser(request):
    if request.method == "POST":
        # Get the posted form       
        id = request.POST['id']
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        username= request.POST['username']
        user = InternInfo.objects.get(id =id )
        user.first_name = first_name
        user.last_name = last_name 
        user.username = username 

        user.save()
    return redirect('/user')
