from django.shortcuts import redirect, render
from intern.models import *

# Create your views here.
def index(request):
    if request.session._session:
        user_id = request.session['user_id']
        user = AuthUser.objects.filter(id=user_id)
        return render(request, 'home.html', {'user':user})
    return redirect('/login')
    