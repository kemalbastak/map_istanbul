from django.contrib import admin

from apps.auth.models import CustomUser


# Register your models here.
@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email')
