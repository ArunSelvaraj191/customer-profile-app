const router = require("express").Router();
const Customer = require("../model/customerModel");

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find({ is_delete: { $ne: 1 } });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  
  try {
    const existingCustomer = await Customer.findOne({ email: req.body.email });
    if (existingCustomer) {
      return res.status(200).json({ message: "Email already exists.",alreadyExist : 1 });
    }
    const customer = new Customer({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
      city: req.body.city,
      code: req.body.code,
      state: req.body.state,
      website: req.body.website,
    });
   
    const newCustomer = await customer.save();
    res.status(200).json({customer : newCustomer,message : 'Customer Inserted',alreadyExist : 0});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/update",async(req,res)=>{
  try{
  const email = req.body.email;
  let updated_data = {
    name: req.body.name,
    mobile: req.body.mobile,
    address: req.body.address,
    city: req.body.city,
    code: req.body.code,
    state: req.body.state,
    website: req.body.website,
  }
  const updatedCustomer = await Customer.updateOne({email},{$set : updated_data})
  if (!updatedCustomer) {
    throw new Error(`Customer with email ${email} not found`);
  }

  return res.status(200).json({customer : updatedCustomer,message : 'Customer Updated'});
}
  catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
})

router.post("/delete/:id", async (req, res) => {
  const customerId = req.params.id;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    await Customer.updateOne(
      { _id: customerId },
      { $set: { is_delete: 1 } }
    );
    res.status(200).json({ message: "Customer deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
