import os
import urllib

from django.conf import settings
from django.db import models
from unrest.models import JsonModel

class AbstractModel(JsonModel):
    class Meta:
        abstract = True
    json_fields = ['id', 'data']

    def __str__(self):
        return self.data.get(
            "name",
            "{} #: {}".format(self.__class__.__name__, self.id)
        )


class Sheet(AbstractModel):
    pass


class Sprite(AbstractModel):
    stored = models.BooleanField(default=False)
    @property
    def sprite_path(self):
        return os.path.join(settings.SPRITE_DIR, self.data['name'] + '.png')
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.stored and not os.path.exists(self.sprite_path):
            response = urllib.request.urlopen(self.data['dataURL'])
            with open(self.sprite_path, 'wb') as f:
                f.write(response.file.read())

class CompositeSprite(AbstractModel):
    pass


class Board(AbstractModel):
    pass


class Level(AbstractModel):
    pass


class BossSet(AbstractModel):
    pass


class MookSet(AbstractModel):
    pass
