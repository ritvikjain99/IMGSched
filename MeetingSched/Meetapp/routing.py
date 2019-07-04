from django.conf.urls import url

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from .consumers import CommentConsumer

application = ProtocolTypeRouter({

    # WebSocket chat handler
    "websocket": AuthMiddlewareStack(
        URLRouter([
            # url(r"^chat/admin/$", AdminChatConsumer),
            url(r"^comment/$", CommentConsumer),
        ])
    ),

    # Using the third-party project frequensgi, which provides an APRS protocol

})