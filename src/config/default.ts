export const defaults={
    storecode:'JHGRH001'
}

// Ensure localStorage is accessed only in the client environment
export const getLocationResponse = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('locationResponse');
     
    }
    return null; // Or any fallback value when on server-side
  };
  
 
export const baseUrl="https://testapi.grozep.com";
