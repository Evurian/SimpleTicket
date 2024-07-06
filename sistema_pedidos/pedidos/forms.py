# pedidos/forms.py
from django import forms
from .models import Pedido

class PedidoForm(forms.ModelForm):
    class Meta:
        model = Pedido
        fields = ['cliente', 'producto', 'cantidad', 'fecha']
        widgets = {
            'cliente': forms.TextInput(attrs={'class': 'form-control'}),
            'producto': forms.Select(attrs={'class': 'form-control'}),
            'cantidad': forms.NumberInput(attrs={'class': 'form-control'}),
            'fecha': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
        }

    def clean_cantidad(self):
        data = self.cleaned_data['cantidad']
        if data <= 0:
            raise forms.ValidationError("La cantidad debe ser mayor a cero.")
        return data
