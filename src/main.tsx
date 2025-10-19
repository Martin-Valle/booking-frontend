// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./styles/index.css";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        async lazy() {
          const { HotelsPage } = await import("./features/hotels/HotelsPage");
          return { Component: HotelsPage };
        },
      },
      {
        path: "hotels",
        async lazy() {
          const { HotelsPage } = await import("./features/hotels/HotelsPage");
          return { Component: HotelsPage };
        },
      },
      {
        path: "flights",
        async lazy() {
          const { FlightsPage } = await import("./features/flights/FlightsPage");
          return { Component: FlightsPage };
        },
      },
      {
        path: "cars",
        async lazy() {
          const { CarsPage } = await import("./features/cars/CarsPage");
          return { Component: CarsPage };
        },
      },
      {
        path: "*",
        async lazy() {
          const mod = await import("./pages/NotFound");
          return { Component: mod.default };
        },
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
