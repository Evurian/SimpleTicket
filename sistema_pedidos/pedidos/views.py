# pedidos/views.py
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Pedido
from .forms import PedidoForm
from django.http import JsonResponse, FileResponse
import io
from reportlab.pdfgen import canvas
from rest_framework import viewsets
from .serializers import PedidoSerializer


class PedidoListView(ListView):
    model = Pedido
    template_name = 'pedidos/pedido_list.html'

class PedidoDetailView(DetailView):
    model = Pedido
    template_name = 'pedidos/pedido_detail.html'

class PedidoCreateView(CreateView):
    model = Pedido
    form_class = PedidoForm
    template_name = 'pedidos/pedido_form.html'
    success_url = reverse_lazy('pedidos:pedido-list')

class PedidoUpdateView(UpdateView):
    model = Pedido
    form_class = PedidoForm
    template_name = 'pedidos/pedido_form.html'
    success_url = reverse_lazy('pedidos:pedido-list')

class PedidoDeleteView(DeleteView):
    model = Pedido
    template_name = 'pedidos/pedido_confirm_delete.html'
    success_url = reverse_lazy('pedidos:pedido-list')

def consulta_json(request):
    pedidos = Pedido.objects.all().values('cliente', 'producto__nombre', 'cantidad', 'fecha')
    return JsonResponse(list(pedidos), safe=False)

def descargar_informe_pdf(request):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(100, 100, "Informe de Pedidos")
    p.showPage()
    p.save()
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename='informe.pdf')

from django.core.mail import send_mail

def enviar_correo(request):
    send_mail(
        'Asunto del correo',
        'Contenido del correo.',
        'from@example.com',
        ['to@example.com'],
        fail_silently=False,
    )
    return JsonResponse({'status': 'Correo enviado'})

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
