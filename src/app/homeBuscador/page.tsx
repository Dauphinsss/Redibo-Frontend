import Home from './home';
import NotFound from '../not-found';

export default function Page() {
  if (!true){
    NotFound()
  }
  return <Home />;
}
