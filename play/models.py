from django.db import models

# Create your models here.
class user(models.Model):
    name = models.CharField(max_length=50)
    pwd = models.CharField(max_length=15)
    class Meta:
        db_table = "user"
class admin(models.Model):
    name = models.CharField(max_length=50)
    pwd = models.CharField(max_length=15)
    class Meta:
        db_table = "admin"
class verify(models.Model):
    name = models.CharField(max_length=50)
    pwd = models.CharField(max_length=15)
    class Meta:
        db_table = "verify"
        
class AudioFile(models.Model):
    filename = models.CharField(max_length=50)
    fileurl = models.CharField(max_length=200)

    class Meta:
        db_table = "audio_files"


class usersongs(models.Model):
    filename = models.CharField(max_length=50)
    fileurl = models.CharField(max_length=200)

    class Meta:
        db_table = "usersongs"

class event(models.Model):
     ename=models.CharField(max_length=50,null=True)
     eurl=models.ImageField(null=True)
     etitle=models.CharField(max_length=100,null=True)
     elink=models.CharField(max_length=100,null=True)
     eplace=models.CharField(max_length=100,null=True)
     eprice=models.CharField(max_length=100,null=True)
     elocation=models.CharField(max_length=100,null=True)
     etiming=models.CharField(max_length=100,null=True)
     class Meta:
          db_table="event"