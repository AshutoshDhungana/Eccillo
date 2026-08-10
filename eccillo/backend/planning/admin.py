from django.contrib import admin
from .models import Event, Milestone, Task, BudgetLineItem, Risk

admin.site.register(Event)
admin.site.register(Milestone)
admin.site.register(Task)
admin.site.register(BudgetLineItem)
admin.site.register(Risk)
