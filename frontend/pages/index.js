import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import SupportForm from '../components/SupportForm';
import TicketChecker from '../components/TicketChecker';
import Stats from '../components/Stats';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>TechCorp Support - 24/7 Customer Success</title>
        <meta name="description" content="Get help from our AI-powered support team. Submit tickets, check status, and get fast responses." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Hero />
      <Features />
      <SupportForm />
      <TicketChecker />
      <Stats />
      <Footer />
    </>
  );
}
