import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const buttonStyles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  btnText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // Filled Button
  btnFilled: {
    backgroundColor: colors.indigo600,
  },
  btnFilledText: {
    color: "white",
  },
  btnFilledPressed: {
    backgroundColor: colors.indigo700,
  },

  // Outline Button
  btnOutline: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: colors.indigo600,
  },
  btnOutlineText: {
    color: colors.indigo600,
  },
  btnOutlinePressed: {
    backgroundColor: colors.indigo100,
  },

  // Shadow Button
  btnShadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },

  // View Button
  btnView: {
    backgroundColor: colors.purple50,
    marginHorizontal: 8,
  },
  btnViewText: {
    color: colors.indigo600,
  },
  btnViewPressed: {
    backgroundColor: colors.purple100,
  },

  // Delete Button
  btnDelete: {
    backgroundColor: colors.pinkBackground,
  },
  btnDeleteText: {
    color: colors.pink,
  },
  btnDeletePressed: {
    backgroundColor: colors.pink100,
  },

  // Activate Button
  btnActivate: {
    backgroundColor: colors.successBackground,
    marginRight: 8,
  },
  btnActivateText: {
    color: colors.success,
  },

  // Deactivate Button
  btnDeactivate: {
    backgroundColor: colors.dangerBackground,
    marginRight: 8,
  },
  btnDeactivateText: {
    color: colors.danger,
  },

  // CTA Button
  btnCta: {
    backgroundColor: colors.indigo600,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 3,
  },
  btnCtaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  btnCtaPressed: {
    backgroundColor: colors.indigo700,
    transform: [{ translateY: 1 }],
  },

  // Edit Button
  btnEdit: {
    backgroundColor: colors.warningBackground,
  },
  btnEditText: {
    color: colors.warning,
  },

  // État pressed général
  btnPressed: {
    opacity: 0.8,
  },

  // Back Button
  btnBack: {
    backgroundColor: colors.pinkBackground,
    paddingVertical: 12, // 0.7rem
    paddingHorizontal: 16, // 1rem
    borderRadius: 8, // 0.5rem
    fontSize: 14, // 0.9rem
    fontWeight: "400", // bold
    textAlign: "center",
    cursor: "pointer",
    transition: `all ${colors.transitionSpeed}`, // Ajout d'une transition
  },
  btnBackHover: {
    backgroundColor: colors.pinkBackgroundHover,
  },
  btnBackFocus: {
    borderWidth: 1,
    borderColor: colors.indigo700,
    boxShadow: `0 0 0 3px ${colors.indigo100}`,
  },
});
