
from django.db import models
from django.core.exceptions import ValidationError
import os

def validate_file_type(value):
    
    ext = os.path.splitext(value.name)[1].lower()
    
    
    valid_image_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    valid_video_extensions = ['.mp4', '.mov', '.avi']
    
    
    if ext not in valid_image_extensions and ext not in valid_video_extensions:
        raise ValidationError('Unsupported file type. Upload an image or video.')


class BaseModel(models. Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True) 
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Incident(BaseModel):
    st_choices = (
        ('Alive', 'Alive'),
        ('Dead', 'Dead'),
        ('Scales', 'Scales'),
        ('Illegal Trade', 'Illegal Trade'),
    )

    municipality = models.CharField(max_length=150, null=True, blank=True)
    city = models.CharField(max_length=150, null=True, blank=True)
    status = models.CharField(max_length=150, choices=st_choices)
    description = models.CharField(max_length=250)

    def __str__(self):

        if self.city:
            return f"{self.city} - {self.id} ({self.status})"
        return f"{self.municipality} - {self.id} ({self.status})"

class Evidence(BaseModel):

    ev_choices = (
        ('Image', 'Image'),
        ('Video', 'Video'),
    )
    evidence_type = models.CharField(max_length=150, choices=ev_choices)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE)
    file = models.FileField(upload_to='media/', null=True, blank=True, validators=[validate_file_type])

    def __str__(self):
       
        if self.file:
            return self.file.name  # Returns the relative file path
        return "No file uploaded"

class Admin(BaseModel):
    username = models.CharField(max_length=250) 
    password = models.CharField(max_length=500)
    email = models.CharField(max_length=150)

    def __str__(self):
        return self.username

class IncidentReport(BaseModel):
    
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)
    incident = models.ForeignKey(Incident, on_delete=models.CASCADE)
    evidence = models.ForeignKey(Evidence, on_delete=models.CASCADE)
    date_reported = models.DateField()

    def __str__(self):
        return f"{self.incident.description}"

class Officer(BaseModel):
    

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    date_joined = models.DateField()
    position = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.last_name}, {self.first_name}"


class Event(BaseModel):
    

    name = models.CharField(max_length=150)
    description = models.CharField(max_length=150)
    date = models.DateField()
    location = models.CharField(max_length=150)
    officer = models.CharField(max_length=250)

    def __str__(self):
        return self.name

class User(BaseModel):

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=150)
    password = models.CharField(max_length=150)
    contact = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.first_name}"
   
    

