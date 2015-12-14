require 'minitest/autorun'

require_relative 'movie'
require_relative 'rental'
require_relative 'customer'

describe Customer do

  before do
    @movie_1 = Movie.new("Iron Man 3", Movie::NEW_RELEASE)
    @movie_2 = Movie.new("Avatar",     Movie::REGULAR)
    @movie_3 = Movie.new("Brave",      Movie::CHILDRENS)

    @customer = Customer.new("Vroni")
  end

  describe "customer statement" do

    it "is printed correctly for a new release movie" do
      @customer.add_rental(Rental.new(@movie_1,  2))
      @customer.statement.must_equal <<-END.strip
Rental Record for Vroni
\tIron Man 3\t6
Amount owed is 6
You earned 2 frequent renter points
    END
    end

    it "is printed correctly for a regular movie" do
      @customer.add_rental(Rental.new(@movie_2, 3))
      @customer.statement.must_equal <<-END.strip
Rental Record for Vroni
\tAvatar\t3.5
Amount owed is 3.5
You earned 1 frequent renter points
    END
    end
     
    it "is printed correctly for a childrens movies" do
      @customer.add_rental(Rental.new(@movie_3, 4))
      @customer.statement.must_equal <<-END.strip
Rental Record for Vroni
\tBrave\t3.0
Amount owed is 3.0
You earned 1 frequent renter points
    END
    end 

    it "is summed up correctly for 3 movies" do
      @customer.add_rental(Rental.new(@movie_1,  2))
      @customer.add_rental(Rental.new(@movie_2, 3))
      @customer.add_rental(Rental.new(@movie_3, 4))
      @customer.statement.must_match /Amount owed is 12.5/
      @customer.statement.must_match /You earned 4 frequent renter points/
    end 
     
  end
end

