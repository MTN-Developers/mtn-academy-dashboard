interface ISemesterProps {
  id: string;
  name_ar: string;
  description_ar: string;
  image_url_ar: string;
  created_at: string;
  price: number;
  slug: string;
}

const SemesterCard = ({
  image_url_ar,
  name_ar,
  description_ar,
}: ISemesterProps) => {
  return (
    <div className="card bg-base-100 w-auto shadow-xl">
      <figure className="h-[150px] bg-gray-200">
        <img className="object-cover" src={image_url_ar} alt={name_ar} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name_ar}</h2>
        <p>{description_ar}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">See Related Courses</button>
        </div>
      </div>
    </div>
  );
};

export default SemesterCard;
