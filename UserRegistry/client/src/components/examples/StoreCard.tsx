import StoreCard from '../StoreCard'

export default function StoreCardExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <StoreCard
          name="Tech Electronics Store"
          address="123 Main Street, Downtown Shopping District, New York, NY 10001"
          rating={4.5}
          onRate={() => console.log('Rate store')}
        />
        <StoreCard
          name="Fashion Boutique Paradise"
          address="456 Oak Avenue, Fashion District, Los Angeles, CA 90012"
          rating={3.8}
          userRating={4}
          onRate={() => console.log('Update rating')}
        />
        <StoreCard
          name="Gourmet Food Market"
          address="789 Pine Road, Food Court Complex, Chicago, IL 60601"
          rating={4.9}
          userRating={5}
          onRate={() => console.log('Update rating')}
        />
      </div>
    </div>
  )
}
