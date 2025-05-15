'use client';

import { useEffect, useState } from 'react';
import Home from './Home';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (id) setShow(true);
  }, [id]);

  return show ? <Home id={String(id)} /> : null;
}
