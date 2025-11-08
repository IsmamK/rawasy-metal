
import Footer from '@/component/home-component/Footer';
import Navbar from '@/component/home-component/Navbar';


export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />

    </>
  );
}