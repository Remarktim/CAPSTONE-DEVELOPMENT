# myapp/management/commands/watch_files.py
from django.core.management.base import BaseCommand
import subprocess

class Command(BaseCommand):
    help = 'Watch files using chokidar'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting file watcher...")
        try:
            # Call chokidar watcher here, subprocess can run it
            subprocess.run(["node", "watch_files.js"], check=True)
        except subprocess.CalledProcessError as e:
            self.stderr.write(f"File watcher failed: {e}")
        except Exception as e:
            self.stderr.write(f"Unexpected error: {e}")
