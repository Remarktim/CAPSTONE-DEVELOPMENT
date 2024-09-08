
from django.db import models

class BaseModel(models. Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True) 
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Incidents(BaseModel):
    st_choices = (
        ('Alive', 'Alive'),
        ('Dead', 'Dead'),
        ('Scales', 'Scales'),
        ('Illegal Trade', 'Illegal Trade'),
    )

    municipality = models.CharField(max_length=150)
    city = models.CharField(max_length=150)
    status = models.CharField(max_length=150, choices=st_choices)
    description = models.CharField(max_length=250)

    def __str__(self):
        return self.description

class Evidences(BaseModel):
    incidents = models.ForeignKey(Incidents, on_delete=models.CASCADE)
    evidence_type = models.CharField(max_length=150)
    file_path = models.CharField(max_length=150)

    def __str__(self):
        return self.incident

class Admins(BaseModel):
    username = models.CharField(max_length=250) 
    password = models.CharField(max_length=500)
    email = models.CharField(max_length=150)

    def __str__(self):
        return self.username

class IncidentReport(BaseModel):
    
    admin = models.ForeignKey(Admins, on_delete=models.CASCADE)
    incident = models.ForeignKey(Incidents, on_delete=models.CASCADE)
    evidence = models.ForeignKey(Evidences, on_delete=models.CASCADE)
    date_joined = models.DateField()

    def __str__(self):
        return self.incident

class Officers(BaseModel):
    

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    date_joined = models.DateField()
    position = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.last_name}, {self.first_name}"


class Officers(BaseModel):
    

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    date_joined = models.DateField()
    position = models.CharField(max_length=150)

    def __str__(self):
        return self.name
    

