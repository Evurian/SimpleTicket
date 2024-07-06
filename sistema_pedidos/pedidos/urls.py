from django.urls import path, include
from .views import (
    PedidoListView, PedidoDetailView, PedidoCreateView, PedidoUpdateView, 
    PedidoDeleteView, consulta_json, descargar_informe_pdf, enviar_correo
)
from rest_framework.routers import DefaultRouter
from .views import PedidoViewSet
app_name = 'pedidos'

urlpatterns = [
    path('', PedidoListView.as_view(), name='pedido-list'),
    path('<int:pk>/', PedidoDetailView.as_view(), name='pedido-detail'),
    path('crear/', PedidoCreateView.as_view(), name='pedido-create'),
    path('<int:pk>/editar/', PedidoUpdateView.as_view(), name='pedido-update'),
    path('<int:pk>/eliminar/', PedidoDeleteView.as_view(), name='pedido-delete'),
    path('consulta_json/', consulta_json, name='consulta-json'),
    path('descargar_informe/', descargar_informe_pdf, name='descargar-informe'),
    path('enviar_correo/', enviar_correo, name='enviar-correo'),
]

router = DefaultRouter()
router.register(r'pedidos', PedidoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
