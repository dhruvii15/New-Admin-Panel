import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';
import AdminProtect from './components/AdminProtect';

import Dashboard from './views/dashboard';
import Header from 'views/Header';
import ForgotPass from 'views/Forgot-pass';
import User from 'views/User';
import Archive from 'views/Archive';

// ==============================|| ROUTES ||============================== //

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>
                  {route.routes ? renderRoutes(route.routes) : <Element />}
                </Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: true,
    path: '/login',
    element: lazy(() => import('./views/Login'))
  },
  {
    exact: 'true',
    path: '/forgot-pass',
    element: () => <ForgotPass />
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: true,
        path: '/dashboard',
        element: () => <AdminProtect><Dashboard /></AdminProtect>
      },
      {
        exact: true,
        path: '/header-section',
        element: () => <AdminProtect><Header /></AdminProtect>
      },
      {
        exact: true,
        path: '/user',
        element: () => <AdminProtect><User /></AdminProtect>
      },
      {
        exact: true,
        path: '/archive',
        element: () => <AdminProtect><Archive /></AdminProtect>
      },
      {
        path: '*',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  },
];

export default renderRoutes;
