import {
  FC,
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  SyntheticEvent,
  FocusEvent
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCustomer,
  fetchCustomers,
  selectAllCustomers,
  selectCustomersStatus,
  updateExistCustomer,
  deleteCustomer,
} from "../redux/slices/index";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Tooltip,
  IconButton,
} from "@mui/material";
import Info from "../assets/InfoIcon.svg";
import {
  phoneMask,
  validateEmail,
  validateMobile,
  validateWebsite,
} from "../helpers/index";
import { Customer } from "../types/index";

const states = [
  { id: "AP", label: "Andhra Pradesh" },
  { id: "AR", label: "Arunachal Pradesh" },
  { id: "AS", label: "Assam" },
  { id: "BR", label: "Bihar" },
  { id: "CG", label: "Chhattisgarh" },
  { id: "GA", label: "Goa" },
  { id: "GJ", label: "Gujarat" },
  { id: "HR", label: "Haryana" },
  { id: "HP", label: "Himachal Pradesh" },
  { id: "JK", label: "Jammu and Kashmir" },
  { id: "JH", label: "Jharkhand" },
  { id: "KA", label: "Karnataka" },
  { id: "KL", label: "Kerala" },
  { id: "MP", label: "Madhya Pradesh" },
  { id: "MH", label: "Maharashtra" },
  { id: "MN", label: "Manipur" },
  { id: "ML", label: "Meghalaya" },
  { id: "MZ", label: "Mizoram" },
  { id: "NL", label: "Nagaland" },
  { id: "OR", label: "Odisha" },
  { id: "PB", label: "Punjab" },
  { id: "RJ", label: "Rajasthan" },
  { id: "SK", label: "Sikkim" },
  { id: "TN", label: "Tamil Nadu" },
  { id: "TS", label: "Telangana" },
  { id: "TR", label: "Tripura" },
  { id: "UK", label: "Uttarakhand" },
  { id: "UP", label: "Uttar Pradesh" },
  { id: "WB", label: "West Bengal" },
  { id: "AN", label: "Andaman and Nicobar Islands" },
  { id: "CH", label: "Chandigarh" },
  { id: "DN", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { id: "DL", label: "Delhi" },
  { id: "LD", label: "Lakshadweep" },
  { id: "PY", label: "Puducherry" },
];

const defaulDetails = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  city: "",
  code: "",
  state: "",
  website: "",
};

const defaultErrors = {
  name: '',
  email: '',
  mobile: '',
  address: '',
  city: '',
  state: '',
  website: '',
}
const Dashboard: FC = () => {
  const dispatch = useDispatch();
  const customers = useSelector(selectAllCustomers);
  const customersStatus = useSelector(selectCustomersStatus);
  const [details, setDetails] = useState(defaulDetails);
  const [editData, setEditData] = useState(defaulDetails);
  const [flag, setFlag] = useState(false);
  const [customerDatas, setCustomerDatas] = useState<Customer[]>([]);
  const [extendIndex, setExtendIndex] = useState(0);
  const [extend, setExtend] = useState(false);
  const [errors, setErrors] = useState(defaultErrors);

  const getDetails = useCallback(async () => {
    await dispatch(fetchCustomers());
  }, []);
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      setDetails((prev) => ({ ...prev, [name]: phoneMask(value) }));
    } else {
      setDetails((prev) => ({ ...prev, [name]: value }));
    }
  }, []);
  const handleChangeState = useCallback(
    (
      e: SyntheticEvent<Element, Event>,
      value: { id: string; label: string }
    ) => {
      const state_value: Pick<Customer, "code" | "state"> = {
        code: value.id,
        state: value.label,
      };
      setDetails((prev) => ({ ...prev, ...state_value }));
    },
    []
  );

  const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'name' && value.length < 3) {
      setErrors((prev) => ({ ...prev, name: 'Please enter a valid name more tha 3 character' }));
    } else if (name === 'email' && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
    }
    else if (name === 'mobile' && value.length != 12) {
      setErrors((prev) => ({ ...prev, mobile: 'Please enter a valid mobile number' }));
    }
    else if (name === 'address' && !value.trim()) {
      setErrors((prev) => ({ ...prev, address: 'Please enter a valid address' }));
    } else if (name === 'city' && !value.trim()) {
      setErrors((prev) => ({ ...prev, city: 'Please enter a valid city' }));
    } else if (name === 'state' && !value) {
      setErrors((prev) => ({ ...prev, state: 'Please select a state' }));
    } else if (name === 'website' && !validateWebsite(value)) {
      setErrors((prev) => ({ ...prev, website: 'Please enter a valid website URL' }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, []);

  const handleCard = useCallback(
    (idx: number) => () => {
      setExtendIndex(idx);
      setExtend(true);
    },
    []
  );

  const addCustomer = useCallback(async () => {
    let response = await dispatch(addNewCustomer(details));
    if (response?.error) {
      alert(response?.error?.message);
    } else {
      const { message, status, alreadyExist } = response?.payload;
      if (alreadyExist) {
        alert(message);
      }else if (status === 200) {
        alert(message);
        setDetails(defaulDetails);
        getDetails();
      }else {
        alert("Something went wrong.!");
      }
    }
  }, [details]);

  const updateCustomer = useCallback(async () => {
    let response = await dispatch(updateExistCustomer(details));
    if (response?.error) {
      alert(response?.error?.message);
    } else {
      const { message, status } = response?.payload;
      if (status === 200) {
        alert(message);
        setDetails(defaulDetails);
        getDetails();
        setFlag(false)
      } else {
        alert("Something went wrong.!");
      }
    }
  }, [details]);
  const handleEdit = useCallback(
    (data: Customer) => () => {
      let edit_data = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        address: data.address,
        city: data.city,
        code: data.code,
        state: data.state,
        website: data.website,
      };
      setFlag(true);
      setEditData(edit_data);
      setDetails(edit_data);
      setErrors(defaultErrors);
    },
    []
  );
  const deleteUser = useCallback(
    (_id: string) => async () => {
      let response = await dispatch(deleteCustomer(_id));
      const { message, status } = response?.payload;
      if (status === 200) {
        alert(message);
        getDetails();
      } else {
        alert("Something went wrong.!");
      }
    },
    []
  );

  const handleClear = useCallback(() => {
    setFlag(false);
    setDetails(defaulDetails);
  }, [])

  useEffect(() => {
    setCustomerDatas(customers);
  }, [customers]);

  useEffect(() => {
    getDetails();
  }, []);

  const { name, email, mobile, address, city, website } = details;
  return (
    <>
      {/* {usersStatus === "loading" && <>Loading......</>} */}
      <Grid container>
        <Grid item xs={6}>
          <Box sx={{
            width: "40%",
            p: "30px",
            position: "fixed",
            top: "0",
            left: "0",
            height: "100vh",
            overflow: "auto",
          }}>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
              Customer Details
            </Typography>
            <TextField
              sx={{ mb: 1 }}
              fullWidth
              label="Full Name"
              required
              variant="outlined"
              name="name"
              value={name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              sx={{ mb: 1 }}
              fullWidth
              label="Email"
              required
              disabled={flag}
              variant="outlined"
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              sx={{ mb: 1 }}
              fullWidth
              label="Mobile"
              required
              variant="outlined"
              name="mobile"
              value={mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.mobile}
              helperText={errors.mobile}
            />
            <TextField
              sx={{ mb: 1 }}
              fullWidth
              label="Address"
              required
              variant="outlined"
              multiline
              rows={4}
              name="address"
              value={address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.address}
              helperText={errors.address}
            />
            <TextField
              sx={{ mb: 1 }}
              fullWidth
              label="City"
              required
              variant="outlined"
              name="city"
              value={city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.city}
              helperText={errors.city}
            />
            <Autocomplete
              sx={{ mb: 1 }}
              options={states}
              value={details.state}
              // getOptionLabel={(option) => option.state}
              onChange={handleChangeState}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select States"
                  placeholder="Select States"
                  name='state'
                  onBlur={handleBlur}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              )}
            />
            <TextField
              sx={{ mb: 1 }}
              fullWidth
              label="website"
              required
              variant="outlined"
              name="website"
              value={website}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.website}
              helperText={errors.website}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                disabled={flag ? JSON.stringify(editData) == JSON.stringify(details) : Object.values(errors).some(e => e) || !Object.values(details).every(e => e)}
                variant="contained"
                size="medium"
                sx={{ mr: 1 }}
                onClick={flag ? updateCustomer : addCustomer}
              >
                {flag ? 'Update' : 'Add'}
              </Button>
              {flag &&
                <Button
                  variant="contained"
                  size="medium"
                  sx={{ mr: 1 }}
                  onClick={handleClear}
                >
                  Clear
                </Button>
              }
              <Tooltip title={"All Fields are required"}>
                <Box component={"img"} src={Info} />
              </Tooltip>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ p: "30px" }}>
          {customerDatas?.length > 0 &&
            customerDatas?.map((data, idx) => (
              <Card
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  height: extendIndex === idx && extend ? "auto" : "100px",
                  maxHeight: extendIndex === idx && extend ? "500px" : "100px", // Set a larger value
                  overflow: "hidden",
                  transition: "max-height 2s ease-out",
                }}
                onClick={handleCard(idx)}
                key={idx}
              >
                <CardContent>
                  <Typography variant="h5">{data?.name}</Typography>
                  <Typography variant="body2">Email : {data?.email}</Typography>
                  {extendIndex === idx && extend && (
                    <>
                      <Typography variant="body2">
                        Mobile : {data?.mobile}
                      </Typography>
                      <Typography variant="body2">
                        Address : {data?.address}
                      </Typography>
                      <Typography variant="body2">
                        City : {data?.city}
                      </Typography>
                      <Typography variant="body2">
                        State : {data?.state}
                      </Typography>
                      <Typography variant="body2">
                        Website : {data?.website}
                      </Typography>
                      <Box sx={{mt : 2}}>
                      <Button
                        variant="outlined"
                        sx={{ mr: 1 }}
                        size="small"
                        onClick={handleEdit(data)}
                        >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={deleteUser(data?._id)}
                        >
                        Delete
                      </Button>
                        </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
