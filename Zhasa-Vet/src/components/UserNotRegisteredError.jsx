import React from 'react';
import { Link } from 'react-router-dom';

export default function UserNotRegisteredError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-muted-foreground">Доступ закрыт.</p>
      <Link to="/" className="text-sm text-primary underline">На главную</Link>
    </div>
  );
}