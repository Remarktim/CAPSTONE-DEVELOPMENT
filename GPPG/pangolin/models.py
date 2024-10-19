import mimetypes
from django.db import models
from django.core.exceptions import ValidationError
import os

def validate_file_type(value):
    
    ext = os.path.splitext(value.name)[1].lower()
    
    
    valid_image_extensions = ['.jpg', '.jpeg', '.png', '.gif']
    valid_video_extensions = ['.mp4', '.mov', '.avi', '.mkv']
    
    
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

    mun_choices = (
        ('Aborlan', 'Aborlan'),
        ('Agutaya', 'Agutaya'),
        ('Araceli', 'Araceli'),
        ('Balabac', 'Balabac'),
        ('Bataraza', 'Bataraza'),
        ('Brooke\'s Point', 'Brooke\'s Point'),
        ('Busuanga', 'Busuanga'),
        ('Cagayancillo', 'Cagayancillo'),
        ('Coron', 'Coron'),
        ('Culion', 'Culion'),
        ('Cuyo', 'Cuyo'),
        ('Dumaran', 'Dumaran'),
        ('El Nido', 'El Nido'),
        ('Kalayaan', 'Kalayaan'),
        ('Linapacan', 'Linapacan'),
        ('Magsaysay', 'Magsaysay'),
        ('Narra', 'Narra'),
        ('Puerto Princesa', 'Puerto Princesa'),
        ('Quezon', 'Quezon'),
        ('Rizal', 'Rizal'),
        ('Roxas', 'Roxas'),
        ('San Vicente', 'San Vicente'),
        ('Sofronio Española', 'Sofronio Española'),
        ('Taytay', 'Taytay'),

    )

    ct_choices = (
        ('Puerto Princesa City', 'Puerto Princesa City'),
    
    )

    municipality = models.CharField(max_length=150, choices=mun_choices, null=True, blank=True)
    city = models.CharField(max_length=150, choices=ct_choices, null=True, blank=True)
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
    fb_url = models.CharField(max_length=150, null=True, blank=True)
    ig_url = models.CharField(max_length=150, null=True, blank=True)
    officer_image = models.ImageField(upload_to='officers/', null=True, blank=True)

    def __str__(self):
        return f"{self.last_name}, {self.first_name}"


class Event(BaseModel):
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=150)
    date = models.DateField()
    location = models.CharField(max_length=150)
    officers = models.CharField(max_length=250)

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


class Gallery(BaseModel):

    gal_choices = (
        ('Image', 'Image'),
        ('Video', 'Video'),
    )
    uploader = models.CharField(max_length=150)
    media_type = models.CharField(max_length=150, blank=True, choices=gal_choices)
    media = models.FileField(upload_to='gallery/', null=True, blank=False, validators=[validate_file_type])

    def save(self, *args, **kwargs):
        if self.media:
            mime_type, encoding = mimetypes.guess_type(self.media.name)

            if mime_type:
                if mime_type.startswith('image/'):
                    self.media_type = 'Image'
                elif mime_type.startswith('video/'):
                    self.media_type = 'Video'
                else:
                    raise ValueError("Unsupported file type")
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.uploader} - {self.media}"
   
    

