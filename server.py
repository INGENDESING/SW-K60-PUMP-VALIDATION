import http.server
import webbrowser
import os
import socket

# Cambiar al directorio de la aplicación
os.chdir('C:/Users/ingen/OneDrive/1.0 PROYECTOS DML/CARTON COLOMBIA/P2603 SW-K60/Desarrollo aplicacion/sw-k60')

# Encontrar puerto disponible
port = 8000
while port < 9000:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(('127.0.0.1', port))
        sock.close()
        break
    except OSError:
        port += 1

print('=' * 60)
print('  P2603 SW-K60 - Servidor Local')
print('=' * 60)
print('')
print(f'Servidor iniciado en: http://localhost:{port}')
print('Abriendo navegador...')

# Abrir el navegador automáticamente
webbrowser.open(f'http://localhost:{port}')

print('')
print('La aplicación debería abrirse en tu navegador.')
print('Si no se abre automáticamente, abre esta URL manualmente:')
print(f'  http://localhost:{port}')
print('')
print('Presiona Ctrl+C para detener el servidor.')
print('=' * 60)
print('')

# Iniciar servidor
server_address = ('', port)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
print(f"Iniciando servidor en puerto {port}...")

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print('\nServidor detenido.')
    httpd.server_close()
