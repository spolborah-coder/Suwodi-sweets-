import { Quote } from 'lucide-react';

interface CustomerReview {
  id: string;
  quote: string;
  customerName: string;
  context: string;
  orderedItem: string;
}

const REVIEWS: CustomerReview[] = [
  {
    id: 'review-1',
    quote:
      'Ordered a 60-piece Puja box of Narikolor Laru and Til Pitha for our family Nam-Prasanga in Joysagar. Everything arrived still crisp and fragrant—exactly like homemade kitchen batches, and ₹10 a piece made planning for guests effortless.',
    customerName: 'Pranjal Hazarika',
    context: 'Joysagar, Sivasagar · Home Delivery',
    orderedItem: 'Puja & Nam-Prasanga Box (60 pcs)',
  },
  {
    id: 'review-2',
    quote:
      'The black sesame filling inside the Til Pitha is generously roasted and never overly sweet. Scheduling an evening pickup directly from Loonpuri Gaon, Kaloogaon took less than a minute and my box was packed warm right on time.',
    customerName: 'Madhumita Das',
    context: 'Kaloogaon, Sivasagar · Local Pickup',
    orderedItem: 'Til Pitha & Tilor Laru',
  },
  {
    id: 'review-3',
    quote:
      'We ordered 100 pieces of Ghila Pitha, Sutuli Pitha, and Narikolor Laru for our daughter’s birthday tea in Sivasagar town. Having authentic jaggery-sweetened Assamese snacks prepared fresh at ₹10 per piece saved us hours in the kitchen.',
    customerName: 'Bhaskarjyoti Kalita',
    context: 'Sivasagar Town · Bulk Home Occasion',
    orderedItem: 'Home Celebration Platter (100 pcs)',
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="py-14 lg:py-20 border-b border-[#E6E2D8] bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E6E2D8]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#8B1E24] mb-2">
              Customer Stories
            </p>
            <h2
              id="testimonials-heading"
              className="font-display text-3xl lg:text-4xl font-semibold text-[#1A1917] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Loved Across Sivasagar &amp; Joysagar Homes
            </h2>
          </div>
          <p className="text-sm text-[#5C5852] max-w-md">
            Honest feedback from families ordering morning-fresh laru, pitha, and bulk occasion platters across
            Sivasagar district.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-7">
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className="bg-[#FAF9F6] border border-[#E6E2D8] rounded-xl p-6 lg:p-7 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#E6E2D8] flex items-center justify-center text-[#8B1E24]">
                  <Quote className="w-4 h-4" aria-hidden="true" />
                </div>

                <blockquote className="text-sm lg:text-[15px] text-[#1A1917] leading-relaxed">
                  “{review.quote}”
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#E6E2D8] space-y-1">
                <p className="text-sm font-semibold text-[#1A1917]">{review.customerName}</p>
                <p className="text-xs text-[#5C5852]">{review.context}</p>
                <p className="text-xs text-[#8B1E24] font-medium pt-0.5">{review.orderedItem}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
