export default function RatingStars({ rating }) {
  return (
    <div style={{ fontSize: 24 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ color: star <= rating ? "#ffc107" : "#e4e5e9" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
