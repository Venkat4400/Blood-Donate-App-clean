-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('donor', 'receiver', 'hospital', 'admin');

-- Create enum for blood types
CREATE TYPE public.blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('pending', 'matched', 'fulfilled', 'cancelled', 'expired');

-- Create enum for urgency levels
CREATE TYPE public.urgency_level AS ENUM ('normal', 'urgent', 'emergency');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create donor_profiles table for donor-specific data
CREATE TABLE public.donor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  blood_type blood_type NOT NULL,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  last_donation_date DATE,
  total_donations INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  reliability_score DECIMAL(3,2) DEFAULT 5.0,
  
  -- Eligibility fields
  has_tattoo_recently BOOLEAN DEFAULT false,
  has_surgery_recently BOOLEAN DEFAULT false,
  has_infectious_disease BOOLEAN DEFAULT false,
  is_smoker BOOLEAN DEFAULT false,
  consumes_alcohol BOOLEAN DEFAULT false,
  has_chronic_illness BOOLEAN DEFAULT false,
  medications TEXT,
  eligibility_score INTEGER DEFAULT 100,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create blood_banks table
CREATE TABLE public.blood_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_24x7 BOOLEAN DEFAULT false,
  has_component_facility BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create blood_inventory table for blood bank stock
CREATE TABLE public.blood_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blood_bank_id UUID REFERENCES public.blood_banks(id) ON DELETE CASCADE NOT NULL,
  blood_type blood_type NOT NULL,
  units_available INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(blood_bank_id, blood_type)
);

-- Create blood_requests table
CREATE TABLE public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  patient_name TEXT NOT NULL,
  blood_type blood_type NOT NULL,
  units_needed INTEGER NOT NULL DEFAULT 1,
  urgency urgency_level DEFAULT 'normal',
  status request_status DEFAULT 'pending',
  hospital_name TEXT,
  hospital_address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  reason TEXT,
  notes TEXT,
  required_by DATE,
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create donation_appointments table
CREATE TABLE public.donation_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  blood_bank_id UUID REFERENCES public.blood_banks(id) ON DELETE SET NULL,
  blood_request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  units_donated INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create donor_matches table for AI matching
CREATE TABLE public.donor_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE CASCADE NOT NULL,
  donor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  match_score DECIMAL(5,2) NOT NULL,
  distance_km DECIMAL(8,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'notified', 'accepted', 'declined', 'expired')),
  notified_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reviewee_type TEXT NOT NULL CHECK (reviewee_type IN ('blood_bank', 'donor', 'hospital')),
  blood_bank_id UUID REFERENCES public.blood_banks(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'emergency', 'match')),
  is_read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for donor_profiles
CREATE POLICY "Anyone can view available donors" ON public.donor_profiles FOR SELECT USING (is_available = true);
CREATE POLICY "Users can view own donor profile" ON public.donor_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Donors can insert own profile" ON public.donor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Donors can update own profile" ON public.donor_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Donors can delete own profile" ON public.donor_profiles FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for blood_banks (public read, admin write)
CREATE POLICY "Anyone can view blood banks" ON public.blood_banks FOR SELECT USING (true);
CREATE POLICY "Admins can manage blood banks" ON public.blood_banks FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for blood_inventory (public read)
CREATE POLICY "Anyone can view blood inventory" ON public.blood_inventory FOR SELECT USING (true);
CREATE POLICY "Admins can manage inventory" ON public.blood_inventory FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for blood_requests
CREATE POLICY "Anyone can view requests" ON public.blood_requests FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create requests" ON public.blood_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Requesters can update own requests" ON public.blood_requests FOR UPDATE USING (auth.uid() = requester_id);
CREATE POLICY "Requesters can delete own requests" ON public.blood_requests FOR DELETE USING (auth.uid() = requester_id);

-- RLS Policies for donation_appointments
CREATE POLICY "Donors can view own appointments" ON public.donation_appointments FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Donors can create appointments" ON public.donation_appointments FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Donors can update own appointments" ON public.donation_appointments FOR UPDATE USING (auth.uid() = donor_id);

-- RLS Policies for donor_matches
CREATE POLICY "Donors can view own matches" ON public.donor_matches FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Requesters can view matches for their requests" ON public.donor_matches FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.blood_requests WHERE id = request_id AND requester_id = auth.uid())
);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_donor_profiles_updated_at BEFORE UPDATE ON public.donor_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blood_banks_updated_at BEFORE UPDATE ON public.blood_banks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON public.blood_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_donation_appointments_updated_at BEFORE UPDATE ON public.donation_appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_matches;