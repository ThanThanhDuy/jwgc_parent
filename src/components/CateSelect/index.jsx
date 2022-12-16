import * as React from "react";
import SelectUnstyled, {
  selectUnstyledClasses,
} from "@mui/base/SelectUnstyled";
import OptionUnstyled, {
  optionUnstyledClasses,
} from "@mui/base/OptionUnstyled";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import { styled } from "@mui/system";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import babysleep from "../../assets/icons/babysleep.png";
import babyeat from "../../assets/icons/babyeat.png";
import babyplay from "../../assets/icons/babyplay.png";
import babylearn from "../../assets/icons/babylearn.png";
import tip from "../../assets/icons/tip.png";

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const Button = React.forwardRef(function Button(props, ref) {
  const { ownerState, ...other } = props;
  return (
    <button type="button" {...other} ref={ref}>
      {other.children}
      <UnfoldMoreRoundedIcon />
    </button>
  );
});

const StyledButton = styled(Button, { shouldForwardProp: () => true })(
  ({ theme }) => `
  letter-spacing: 0.5px;
  font-size: 14px;
  box-sizing: border-box;
  min-width: 320px;
  padding: 8px;
  border-radius: 12px;
  text-align: left;
  line-height: 1.5;
  background: #f0f2f5;
  border: 1px solid #d4d4d4;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  position: relative;

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background:#ebecfe;
    color: #2f3ab2;
    border-color: #2f3ab2;
  }

  & > svg {
    font-size: 1rem;
    position: absolute;
    height: 100%;
    top: 0;
    right: 10px;
  }
  `
);

const StyledListbox = styled("ul")(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 320px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  box-shadow: 0px 4px 30px ${
    theme.palette.mode === "dark" ? grey[900] : grey[200]
  };
  z-index: 99;
  `
);

const StyledOption = styled(OptionUnstyled)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  letter-spacing: 0.5px;
  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: #ebecfe;
    color: #2f3ab2;
    
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: #ebecfe;
    color: #2f3ab2;
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: #ebecfe;
    color: #2f3ab2;
  }

  &.${optionUnstyledClasses.disabled} {
    color: #2f3ab2;
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: #ebecfe;
    color: #2f3ab2;
  }
  `
);

const StyledPopper = styled(PopperUnstyled)`
  z-index: 99;
`;

const CustomSelect = React.forwardRef(function CustomSelect(props, ref) {
  const slots = {
    root: StyledButton,
    listbox: StyledListbox,
    popper: StyledPopper,
    ...props.slots,
  };

  return <SelectUnstyled {...props} ref={ref} slots={slots} />;
});
const data = [
  {
    Icon: babyeat,
    label: "Chăm sóc bữa ăn cho bé",
    code: "2",
  },
  {
    Icon: babysleep,
    label: "Chăm sóc giấc ngủ cho bé",
    code: "3",
  },
  {
    Icon: babyplay,
    label: "Vui chơi cùng bé",
    code: "4",
  },
  {
    Icon: babylearn,
    label: "Học tập cùng bé",
    code: "5",
  },
  {
    Icon: tip,
    label: "Tip, mẹo vặt",
    code: "6",
  },
];
export default function CateSelect({ onChange, value }) {
  const handleChangeSelect = (e, newValue) => {
    onChange(newValue);
  };

  return (
    <CustomSelect value={value} onChange={handleChangeSelect}>
      {data.map((item) => (
        <StyledOption value={Number(item.code)} key={item.code}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              style={{
                width: "18px",
                height: "18px",
                marginRight: "8px",
                display: "block",
              }}
              src={item.Icon}
              alt="icon"
            />
            <span style={{ display: "block" }}>{item.label}</span>
          </div>
        </StyledOption>
      ))}
    </CustomSelect>
  );
}
