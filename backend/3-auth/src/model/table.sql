  CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL UNIQUE,
    gigId text NOT NULL,
    reviewerId text NOT NULL,
    orderId text NOT NULL,
    sellerId text NOT NULL,
    review text NOT NULL,
    reviewerImage text NOT NULL,
    reviewerUsername text NOT NULL,
    country text NOT NULL,
    reviewType text NOT NULL,
    rating integer DEFAULT 0 NOT NULL,
    createdAt timestamp DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
  );

  CREATE INDEX IF NOT EXISTS gigId_idx ON public.reviews (gigId);

  CREATE INDEX IF NOT EXISTS sellerId_idx ON public.reviews (sellerId);
