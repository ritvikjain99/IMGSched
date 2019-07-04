from .views import UserViewSet, MeetingViewSet, CommentViewSet
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views
from django.urls import path


router = DefaultRouter()
router.register(r'api/users', UserViewSet, basename='user')
router.register(r'api/meetings', MeetingViewSet, basename='meetings')
router.register(r'api/comments', CommentViewSet, basename='comments')

urlpatterns = [
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/users/<string: username>/', views.UsernameView.as_view(), name='username_view'),
]

urlpatterns += router.urls
