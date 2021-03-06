from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path, include

import unrest.views
# from unrest.nopass.views import create as nopass_create

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', unrest.views.spa),
    # path('api/nopass/', include('unrest.nopass.urls')),
    # re_path('api/(server|uc).([^/]+)/$', unrest.views.superuser_api_view),
    # path("user.json", unrest.views.user_json),
    # path("api/auth/register/", nopass_create),
    re_path('app/(?:.*)', unrest.views.index)
]

if settings.DEBUG:
    urlpatterns.append(re_path(
        'tests/',
        unrest.views.index,
        kwargs={'path': 'dist/tests/index.html'},
    ))
