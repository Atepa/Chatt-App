import jwt from 'jsonwebtoken';

const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
  
    if (token) {
        try {
          const decodedToken = jwt.decode(token);
      
          if (decodedToken) {
            console.log('Decoded Token:', decodedToken);
      
            const currentTime = Date.now() / 1000; // Zamanı saniyelerle al
            if (decodedToken.exp && currentTime > decodedToken.exp) {
                console.log('Token süresi doldu.');
                return {msg:'Oturum Süresi Sonlandırılmış. Ana Sayfaya Yönlendiriliyorsunuz.', status: false};
            } else {
              console.log('Token hala geçerli.');
              return { status: true};

            }
          }
        } catch (error) {
          console.error('Token parçalanırken bir hata oluştu:', error);
          return { msg:'Token Parçalama Hatası.', error, status: true};
        }
    }
    return {msg:'Ana Sayfaya Yönlendiriliyorsunuz.', status: false};
  };
  
  export default checkTokenExpiration;
  